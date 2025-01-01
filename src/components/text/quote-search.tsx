"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@prisma/client";
import { Copy, Rabbit, Settings2 } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { Cursor } from "../ui/cursor";
import { Badge } from "../ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

export default function QuoteSearch({ text }: { text: Text }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<string[]>([]);
	const [contextSize, setContextSize] = useState(3);
	const [unlimited, setUnlimited] = useState(false);
	const [maxResults, setMaxResults] = useState(25);

	const splitIntoSentences = (text: string): string[] => {
		return text.match(/[^.!?]+[.!?]+[\])'"`'"]*|.+/g) || [];
	};

	const findKeywordMatches = (sentences: string[], keyword: string) => {
		const searchTerm = keyword.toLowerCase();
		const matchedIndices: number[] = [];

		sentences.forEach((sentence, index) => {
			if (sentence.toLowerCase().includes(searchTerm)) {
				matchedIndices.push(index);
			}
		});

		return unlimited ? matchedIndices : matchedIndices.slice(0, maxResults);
	};

	const getContextSentences = (
		sentences: string[],
		matchedIndices: number[],
		contextSize = 3
	) => {
		const results: string[] = [];

		matchedIndices.forEach((matchIndex) => {
			const start = Math.max(0, matchIndex - contextSize);
			const end = Math.min(sentences.length, matchIndex + contextSize + 1);
			const context = sentences.slice(start, end).join(" ");
			results.push(context);
		});

		return results;
	};

	const handleSearch = () => {
		if (!searchQuery.trim()) return;

		const sentences = splitIntoSentences(text.content);
		const matchedIndices = findKeywordMatches(sentences, searchQuery);
		const results = getContextSentences(sentences, matchedIndices, contextSize);
		setSearchResults(results);
	};

	const highlightSearchTerm = (text: string, searchTerm: string) => {
		if (!searchTerm) return text;

		const regex = new RegExp(`(${searchTerm})`, "gi");
		const parts = text.split(regex);

		return parts.map((part, index) =>
			part.toLowerCase() === searchTerm.toLowerCase() ? (
				<strong key={index} className="font-bold">
					{part}
				</strong>
			) : (
				part
			)
		);
	};

	const handleCopyQuote = async (quote: string) => {
		try {
			await navigator.clipboard.writeText(quote);
			toast.success("Quote copied to clipboard");
		} catch (error) {
			toast.error("Failed to copy quote");
			console.error("Error copying:", error);
		}
	};

	return (
		<Card className="mt-16">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Quote Search</CardTitle>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<Settings2 className="h-5 w-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-72">
						<DropdownMenuLabel>Search Settings</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<div className="p-4 space-y-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label>Context Size: {contextSize} sentences</Label>
								</div>
								<Slider
									value={[contextSize]}
									onValueChange={(value) => setContextSize(value[0])}
									min={1}
									max={8}
									step={1}
									className="w-full"
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label>Unlimited Results</Label>
								<Switch checked={unlimited} onCheckedChange={setUnlimited} />
							</div>

							{!unlimited && (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label>Max Results: {maxResults}</Label>
									</div>
									<Slider
										value={[maxResults]}
										onValueChange={(value) => setMaxResults(value[0])}
										min={5}
										max={50}
										step={5}
										disabled={unlimited}
										className="w-full"
									/>
								</div>
							)}
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex space-x-4">
					<Input
						placeholder="Enter search term..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleSearch();
							}
						}}
					/>
					<Button onClick={handleSearch}>Search</Button>
				</div>

				{searchResults.length > 0 ? (
					<>
						<div>
							<h4 className="text-xl font-semibold tracking-tight">
								Search Results
							</h4>
							<p>Found {searchResults.length} results</p>
						</div>

						<ScrollArea className="h-[calc(100vh-320px)] w-full" type="always">
							<div className="space-y-4">
								{searchResults.map((result, index) => (
									<div
										key={index}
										className="text-sm group p-4 rounded-md border hover:bg-accent"
										onClick={() => handleCopyQuote(result)}
									>
										<div>
											<Cursor
												attachToParent
												className="overflow-hidden"
												springConfig={{
													bounce: 0.01,
												}}
											>
												<Badge>
													<Copy className="w-4 h-4" />
												</Badge>
											</Cursor>
											{highlightSearchTerm(result, searchQuery)}
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					</>
				) : (
					<Card className="mt-4">
						<CardHeader>
							<CardTitle className="flex items-center">
								No Results
								<Rabbit className="h-6 w-6 ml-2" />
							</CardTitle>
							<CardDescription>Try searching for another word.</CardDescription>
						</CardHeader>
					</Card>
				)}
			</CardContent>
		</Card>
	);
}
